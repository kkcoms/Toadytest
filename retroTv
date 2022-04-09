const gifTVURLs = [
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117878/trippy-square_jqupb3.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117878/space-stallions_zmueag.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117882/dancing-bears-small_v4oqvi.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117881/trippy-rick_a42hyj.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117882/psychedelic-reindeer_an5vsi.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571117877/jake-the-dog_scm4bi.gif",
	"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571120920/the-regular-show_pwt1gp.gif"
];

class GifTV {
	constructor(
		channels = [
			"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571155222/giphy_n0r827.gif"
		]
	) {
		// elements
		this.gifVideo = document.getElementById("gif_tv_video");
		this.pixels = document.getElementById("gif_tv_pixels");
		this.viewport = document.getElementById("gif_tv_viewport");

		// data
		this.channels = channels;
		this.staticGIF =
			"https://res.cloudinary.com/cyborgspaceviking/image/upload/v1571155222/giphy_n0r827.gif";
		this.currentChannelURL = this.channels[0];

		// sounds
		this.sound = {
			static: "https://freesound.org/data/previews/41/41029_410502-lq.mp3",
			dial: "https://freesound.org/data/previews/485/485486_10145800-lq.mp3",
			switch: "https://freesound.org/data/previews/219/219477_4056007-lq.mp3"
		};

		// dials
		this.dial = {
			// Channels Dial
			channel: {
				button: document.getElementById("gif_tv_button_channel"),
				currentIndex: 0,
				message: document.getElementById("gif_tv_message_channel"),
				messageTimer: null
			},
			// Volume Dial
			volume: {
				button: document.getElementById("gif_tv_button_volume"),
				currentIndex: 8,
				message: document.getElementById("gif_tv_message_volume"),
				messageTimer: null
			}
		};

		// switches
		this.switch = {
			// Mute Switch
			mute: {
				button: document.getElementById("gif_tv_button_mute"),
				isActive: false,
				message: document.getElementById("gif_tv_message_mute"),
				messageTimer: null
			},
			// HD Switch
			hd: {
				button: document.getElementById("gif_tv_button_hd"),
				isActive: true,
				message: document.getElementById("gif_tv_message_hd"),
				messageTimer: null
			},
			// Hue Shift Switch
			hue: {
				button: document.getElementById("gif_tv_button_hue_shift"),
				isActive: false,
				message: document.getElementById("gif_tv_message_hue_shift"),
				messageTimer: null
			},
			// Bright Switch
			bright: {
				button: document.getElementById("gif_tv_button_bright"),
				isActive: true,
				message: document.getElementById("gif_tv_message_bright"),
				messageTimer: null
			},
			// Black & White Switch
			color: {
				button: document.getElementById("gif_tv_button_color"),
				isActive: true,
				message: document.getElementById("gif_tv_message_color"),
				messageTimer: null
			}
		};
	}

	log() {
		console.log("gif TV on");
	}

	playSound(url, volume) {
		const sound = new Audio();
		sound.src = url;
		sound.volume = volume / 10;
		this.switch.mute.isActive !== true ? sound.play() : null;
	}

	displayStatic() {
		this.gifVideo.setAttribute("src", this.staticGIF);
	}

	displayChannel() {
		this.gifVideo.setAttribute("src", this.currentChannelURL);
	}

	updateMessage(messageObj, theMessage) {
		let messageElem = messageObj.message;
		messageElem.innerHTML = theMessage;

		clearTimeout(messageObj.messageTimer);

		if (!messageElem.classList.contains("active")) {
			messageElem.classList.add("active");
		}

		messageObj.messageTimer = setTimeout(() => {
			messageElem.classList.remove("active");
		}, 2000);
	}

	leadingZero(num, size) {
		var int = num + "";
		while (int.length < size) int = "0" + int;
		return int;
	}

	changeChannel(direction) {
		const updateMessage = () => {
			let channelsDecimal = (this.channels.length + 1) / 10;
			let channelIndex = this.leadingZero(
				this.dial.channel.currentIndex + 1,
				channelsDecimal < 2 ? 2 : channelsDecimal
			);
			this.updateMessage(this.dial.channel, `CH ${channelIndex}`);
		};

		this.playSound(this.sound.dial, this.dial.volume.currentIndex);
		this.playSound(this.sound.static, this.dial.volume.currentIndex / 50);
		this.displayStatic();

		switch (direction) {
			case "up":
				this.dial.channel.currentIndex === this.channels.length - 1
					? (this.dial.channel.currentIndex = 0)
					: this.dial.channel.currentIndex++;
				updateMessage();
				break;
			case "down":
				this.dial.channel.currentIndex === 0
					? (this.dial.channel.currentIndex = this.channels.length - 1)
					: this.dial.channel.currentIndex--;
				updateMessage();
				break;
			default:
				this.dial.channel.currentIndex === this.channels.length - 1
					? (this.dial.channel.currentIndex = 0)
					: this.dial.channel.currentIndex++;
				updateMessage();
		}

		setTimeout(() => {
			this.currentChannelURL = this.channels[this.dial.channel.currentIndex];
			this.displayChannel();
		}, 333);
	}

	changeVolume(direction) {
		const updateMessage = () => {
			let volumeIndex = this.leadingZero(this.dial.volume.currentIndex, 2);
			this.updateMessage(this.dial.volume, `VOL ${volumeIndex}`);
		};

		this.playSound(this.sound.dial, this.dial.volume.currentIndex);

		switch (direction) {
			case "up":
				this.dial.volume.currentIndex === 10
					? null
					: this.dial.volume.currentIndex++;
				updateMessage();
				break;
			case "down":
				this.dial.volume.currentIndex === 1
					? null
					: this.dial.volume.currentIndex--;
				updateMessage();
				break;
			default:
				this.dial.volume.currentIndex === 10
					? null
					: this.dial.volume.currentIndex++;
				updateMessage();
		}
	}

	toggleMute() {
		if (this.switch.mute.isActive) {
			this.switch.mute.isActive = false;
			this.playSound(this.sound.switch, this.dial.volume.currentIndex);
			this.updateMessage(this.switch.mute, `SOUND`);
		} else {
			this.playSound(this.sound.switch, this.dial.volume.currentIndex);
			this.switch.mute.isActive = true;
			this.updateMessage(this.switch.mute, `MUTE`);
		}
	}

	toggleHighDef() {
		this.playSound(this.sound.switch, this.dial.volume.currentIndex);

		if (this.switch.hd.isActive) {
			this.pixels.style.setProperty("visibility", "hidden");
			this.switch.hd.isActive = false;
			this.updateMessage(this.switch.hd, `HIGH DEF`);
		} else {
			this.pixels.style.setProperty("visibility", "visible");
			this.switch.hd.isActive = true;
			this.updateMessage(this.switch.hd, `STND DEF`);
		}
	}

	toggleHueShift() {
		this.playSound(this.sound.switch, this.dial.volume.currentIndex);

		if (this.switch.hue.isActive) {
			this.gifVideo.setAttribute("style", "filter: none");
			this.switch.hue.isActive = false;
			// since this is overriding colorOn we set it back to the default
			this.switch.color.isActive = true;
			this.updateMessage(this.switch.hue, `NO SHIFT`);
		} else {
			this.gifVideo.setAttribute(
				"style",
				"animation: rainbow_barf infinite 2000ms;"
			);
			this.switch.hue.isActive = true;
			// since this is overriding colorOn we set it back to the default
			this.switch.color.isActive = true;
			this.updateMessage(this.switch.hue, `HUE SHIFT`);
		}
	}

	toggleBright() {
		this.playSound(this.sound.switch, this.dial.volume.currentIndex);

		if (this.switch.bright.isActive) {
			this.viewport.setAttribute("style", "opacity: 0.5;");
			this.switch.bright.isActive = false;
			this.updateMessage(this.switch.bright, `DARK`);
		} else {
			this.viewport.setAttribute("style", "opacity: 1;");
			this.switch.bright.isActive = true;
			this.updateMessage(this.switch.bright, `BRIGHT`);
		}
	}

	toggleColor() {
		this.playSound(this.sound.switch, this.dial.volume.currentIndex);

		if (this.switch.color.isActive) {
			this.gifVideo.setAttribute("style", "filter: grayscale(100%);");
			this.switch.color.isActive = false;
			// since this is overriding invertColor we set it back to the default
			this.switch.hue.isActive = false;
			this.updateMessage(this.switch.color, `B&W`);
		} else {
			this.gifVideo.setAttribute("style", "filter: none");
			this.switch.color.isActive = true;
			// since this is overriding invertColor we set it back to the default
			this.switch.hue.isActive = false;
			this.updateMessage(this.switch.color, `COLOR`);
		}
	}

	init() {
		// this.log();

		this.displayChannel();

		// Channel Dial
		this.dial.channel.button.addEventListener("click", () => {
			this.changeChannel("up");
		});
		this.dial.channel.button.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			this.changeChannel("down");
		});

		// Volume Dial
		this.dial.volume.button.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			this.changeVolume("up");
		});
		this.dial.volume.button.addEventListener("click", () => {
			this.changeVolume("down");
		});

		// Mute Switch
		this.switch.mute.button.addEventListener("click", () => {
			this.toggleMute();
		});

		// HD Switch
		this.switch.hd.button.addEventListener("click", () => {
			this.toggleHighDef();
		});

		// Hue Shift Switch
		this.switch.hue.button.addEventListener("click", () => {
			this.toggleHueShift();
		});

		// Brightness Switch
		this.switch.bright.button.addEventListener("click", () => {
			this.toggleBright();
		});

		// Black and White Switch
		this.switch.color.button.addEventListener("click", () => {
			this.toggleColor();
		});

		document.onkeydown = (e) => {
			e.preventDefault();
			// left key
			e.keyCode == "39" ? this.changeChannel("up") : null;
			// right key
			e.keyCode == "37" ? this.changeChannel("down") : null;
			// up key
			e.keyCode == "38" ? this.changeVolume("up") : null;
			// down key
			e.keyCode == "40" ? this.changeVolume("down") : null;
		};
	}
}

const gifTV = new GifTV(gifTVURLs);

gifTV.init();
