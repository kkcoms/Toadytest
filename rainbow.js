<script type="text/javascript"  src="https://cdnjs.cloudflare.com/ajax/libs/three.js/86/three.min.js"></script>

<script type="text/javascript"  src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.6.5/dat.gui.min.js"></script>

<script>
class World {
  constructor(width, height) {

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.container = document.getElementsByClassName("world")[0];
    this.scene = new THREE.Scene();
    this.width = width;
    this.height = height;
    this.aspectRatio = width / height;
    this.fieldOfView = 50;
    var nearPlane = .1;
    var farPlane = 20000;
    this.camera = new THREE.PerspectiveCamera(this.fieldOfView, this.aspectRatio, nearPlane, farPlane);
		this.camera.position.z = 200;
		this.container.appendChild(this.renderer.domElement);
    this.timer = 0;
		this.mousePos = {x:0, y:0};
		this.targetMousePos = {x:0, y:0};
    this.createPlane();
		this.render();
  }

  createPlane(){
    this.material = new THREE.RawShaderMaterial({
      vertexShader: document.getElementById( 'vertexShader' ).textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
     
      uniforms: { 
				uTime: { type: 'f', value: 0 },
				uHue: {type: 'f', value: .5},
				uHueVariation: {type: 'f', value: 1},
				uGradient: {type: 'f', value: 1},
				uDensity: {type: 'f', value: 1},
				uDisplacement: {type: 'f', value: 1},				
				uMousePosition: {type: 'v2', value: new THREE.Vector2( 0.5, 0.5 ) }
    	}
    });
    this.planeGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);

    this.plane = new THREE.Mesh(this.planeGeometry, this.material);
		this.scene.add(this.plane);
  }
	
  render() {
    this.timer += parameters.speed;
		this.plane.material.uniforms.uTime.value = this.timer;
		
		this.mousePos.x += (this.targetMousePos.x - this.mousePos.x) * .1;
		this.mousePos.y += (this.targetMousePos.y - this.mousePos.y) * .1;
		
		if (this.plane){
			this.plane.material.uniforms.uMousePosition.value = new THREE.Vector2(this.mousePos.x, this.mousePos.y);
		}
		
		this.renderer.render(this.scene, this.camera);
  }

  loop() {
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  updateSize(w, h) {
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
  mouseMove(mousePos) {
		this.targetMousePos.x = mousePos.px;
		this.targetMousePos.y = mousePos.py;
  }
};

document.addEventListener("DOMContentLoaded", domIsReady);
let mousePos = {x:0, y:0, px:0, py:0};
let world;
let gui = new dat.GUI();
dat.GUI.toggleHide();


let parameters = {
  speed: .2,
	hue: .5,
	hueVariation: 1,
	gradient: .3,
	density: 0,
	displacement: .66,
	
}

function domIsReady() {
	world = new World(this.container, this.renderer, window.innerWidth, window.innerHeight);
	window.addEventListener('resize', handleWindowResize, false);
	document.addEventListener("mousemove", handleMouseMove, false);
	handleWindowResize();
	world.loop();
	initGui();
}

var guiHue;

function initGui(){
	gui.width = 250;
  guiSpeed = gui.add(parameters, 'speed').min(.1).max(1).step(.01).name('speed');
	guiHue = gui.add(parameters, 'hue').min(0).max(1).step(.01).name('hue');
	guiVariation = gui.add(parameters, 'hueVariation').min(0).max(1).step(.01).name('hue variation');
	//guiGradient = gui.add(parameters, 'gradient').min(0).max(1).step(.01).name('inner gradient');
	guiDensity = gui.add(parameters, 'density').min(0).max(1).step(.01).name('density');
	guiDisp = gui.add(parameters, 'displacement').min(0).max(1).step(.01).name('displacement');
	
	guiHue.onChange( function(value) {
		updateParameters();
	});
	
	guiVariation.onChange( function(value) {
		updateParameters();
	});
	/*
	guiGradient.onChange( function(value) {
		updateParameters();
	});
	*/
	guiDensity.onChange( function(value) {
		updateParameters();
	});
	
	guiDisp.onChange( function(value) {
		updateParameters();
	});
	updateParameters();
}

function updateParameters(){
	world.plane.material.uniforms.uHue.value = parameters.hue;
	world.plane.material.uniforms.uHueVariation.value = parameters.hueVariation;
	//world.plane.material.uniforms.uGradient.value = parameters.gradient;
	world.plane.material.uniforms.uDensity.value = parameters.density;
	world.plane.material.uniforms.uDisplacement.value = parameters.displacement;
}

function handleWindowResize() {
    world.updateSize(window.innerWidth, window.innerHeight);
}

function handleMouseMove(e) {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    mousePos.px = mousePos.x / window.innerWidth;
    mousePos.py = 1.0 - mousePos.y / window.innerHeight;
    world.mouseMove(mousePos);
}

</script>

<script type="x-shader/x-fragment" id="fragmentShader">
	precision highp float;

	uniform float uTime;
	uniform vec2 uMousePosition;
	uniform float uHue;
	uniform float uHueVariation;
	uniform float uDensity;
	uniform float uDisplacement;
	uniform float uGradient;
	
	varying vec2 vUv;

	float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
	vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
	vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

	float rand(vec2 co){
		return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
	}

	float hue2rgb(float f1, float f2, float hue) {
			if (hue < 0.0)
					hue += 1.0;
			else if (hue > 1.0)
					hue -= 1.0;
			float res;
			if ((6.0 * hue) < 1.0)
					res = f1 + (f2 - f1) * 6.0 * hue;
			else if ((2.0 * hue) < 1.0)
					res = f2;
			else if ((3.0 * hue) < 2.0)
					res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
			else
					res = f1;
			return res;
	}

	vec3 hsl2rgb(vec3 hsl) {
			vec3 rgb;

			if (hsl.y == 0.0) {
					rgb = vec3(hsl.z); // Luminance
			} else {
					float f2;

					if (hsl.z < 0.5)
							f2 = hsl.z * (1.0 + hsl.y);
					else
							f2 = hsl.z + hsl.y - hsl.y * hsl.z;

					float f1 = 2.0 * hsl.z - f2;

					rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
					rgb.g = hue2rgb(f1, f2, hsl.x);
					rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
			}
			return rgb;
	}

	vec3 hsl2rgb(float h, float s, float l) {
			return hsl2rgb(vec3(h, s, l));
	}

	float noise(vec3 p){
			vec3 a = floor(p);
			vec3 d = p - a;
			d = d * d * (3.0 - 2.0 * d);

			vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
			vec4 k1 = perm(b.xyxy);
			vec4 k2 = perm(k1.xyxy + b.zzww);

			vec4 c = k2 + a.zzzz;
			vec4 k3 = perm(c);
			vec4 k4 = perm(c + 1.0);

			vec4 o1 = fract(k3 * (1.0 / 41.0));
			vec4 o2 = fract(k4 * (1.0 / 41.0));

			vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
			vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

			return o4.y * d.y + o4.x * (1.0 - d.y);
	}

	vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

	float cnoise(vec2 P){
			vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
			vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
			Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
			vec4 ix = Pi.xzxz;
			vec4 iy = Pi.yyww;
			vec4 fx = Pf.xzxz;
			vec4 fy = Pf.yyww;
			vec4 i = perm(perm(ix) + iy);
			vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
			vec4 gy = abs(gx) - 0.5;
			vec4 tx = floor(gx + 0.5);
			gx = gx - tx;
			vec2 g00 = vec2(gx.x,gy.x);
			vec2 g10 = vec2(gx.y,gy.y);
			vec2 g01 = vec2(gx.z,gy.z);
			vec2 g11 = vec2(gx.w,gy.w);
			vec4 norm = 1.79284291400159 - 0.85373472095314 *
			vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
			g00 *= norm.x;
			g01 *= norm.y;
			g10 *= norm.z;
			g11 *= norm.w;
			float n00 = dot(g00, vec2(fx.x, fy.x));
			float n10 = dot(g10, vec2(fx.y, fy.y));
			float n01 = dot(g01, vec2(fx.z, fy.z));
			float n11 = dot(g11, vec2(fx.w, fy.w));
			vec2 fade_xy = fade(Pf.xy);
			vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
			float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
			return 2.3 * n_xy;
	}

	void main () {
		float mouseDistance = length(vUv - uMousePosition);
		float t = uTime * .005;
		float elevation =  vUv.y * uDensity * 30.0;
		
		float shadow = smoothstep(0.0, .3 + sin(t * 5.0 * 3.14) * .1 , mouseDistance);
		elevation += shadow * 5.0;
		
		float displacement = cnoise( vec2( t + vUv.y * 2.0, t + vUv.x * 3.0 )) * uDisplacement * 3.0 ;

		elevation += displacement * 4.0;
		elevation *= 2.0 + cnoise( vec2( t + vUv.y * 1.0, t + .5)) * 2.0 ;
		
		//elevation += cnoise ( vec2 (elevation * .1, t * 3.0) );

		float light = .9 + fract(elevation) ;
		light *= .9 + (1.0 - (displacement * displacement)) * .1;
		elevation = floor(elevation);
		//elevation += uGradient * .25;
	
		float hue =  uHue + shadow * .1 + cnoise( vec2( elevation * .10, .1 + t)) * uHueVariation;
		float saturation = .6;;
		float brightness =  - (1.0 - shadow) * .1 + .5  - smoothstep( 0.0, .9,  cnoise( vec2( elevation * .5, .4 + t * 5.0)) ) * .1;


		vec3 hslCol = vec3( hue, saturation, brightness);
		vec3 col = hsl2rgb(hslCol) * vec3(light, 1.0, 1.0);
		
		
		/* circle:
		float d = length(vUv- vec2(.5,.5));
		float radius = .1;// + (t * .1);
		float stroke = 0.001;
		float smoothing = .0005;
		d = smoothstep(radius, radius+smoothing, d) - smoothstep(radius+stroke, radius+stroke+smoothing, d);
		
		col += d;// * 10.0;
		*/
		
		gl_FragColor = vec4(col, 1.);
	}
</script>  

<script type="x-shader/x-vertex" id="vertexShader">  
  // attributes of our mesh
	attribute vec3 position;
	attribute vec2 uv;

	// built-in uniforms from ThreeJS camera and Object3D
	uniform mat4 projectionMatrix;
	uniform mat4 modelViewMatrix;
	uniform mat3 normalMatrix;

	// custom uniforms to build up our tubes
	uniform float uTime;
	uniform vec2 uMousePosition;

	// pass a few things along to the vertex shader
	varying vec2 vUv;

	void main() {
		vUv = uv;
		vec4 pos = vec4(position, 1.0);
		gl_Position = pos;
	}
</script>
