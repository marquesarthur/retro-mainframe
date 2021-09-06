// https://codepen.io/SupremoHQ/pen/vYEvMGG
class glitch {

    constructor(el, base64) {

        // create stage
        const imgLink = base64
        const canvas = document.getElementById(el);

        var tmpImg = new Image()
        tmpImg.src = base64

        const app = new PIXI.Application({
            view: canvas,
            width: 1000,
            height: 1000,
            transparent: true,
            resolution: 1,
        })

        // image
        this.img = new PIXI.Sprite.from(imgLink);

        setTimeout(() => {
            // center image
            this.img.width = Math.min(tmpImg.width, 850);
            this.img.height = Math.min(tmpImg.height, 850);
            this.img.x = (app.screen.width / 2) - 50;
            this.img.y = (app.screen.height / 2) - 50;
            this.img.anchor.x = 0.5;
            this.img.anchor.y = 0.5;

            // add image to stage
            app.stage.addChild(this.img);

            // create all filters, rgb split and glitch slices
            this.img.filters = [new PIXI.filters.RGBSplitFilter(), new PIXI.filters.GlitchFilter()];

            // reset rgb split
            this.img.filters[0].red.x = 0;
            this.img.filters[0].red.y = 0;
            this.img.filters[0].green.x = 0;
            this.img.filters[0].green.y = 0;
            this.img.filters[0].blue.x = 0;
            this.img.filters[0].blue.y = 0;

            // reset glitch
            this.img.filters[1].slices = 0;
            this.img.filters[1].offset = 20;

            // begin animation
            this.anim = this.anim.bind(this);
            this.anim();
        }, 3000);
    }

    randomIntFromInterval(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    anim() {

        const THAT = this

        const tl = gsap.timeline({
            delay: this.randomIntFromInterval(0, 3),
            onComplete: this.anim
        });

        tl.to(this.img.filters[0].red, {
            duration: 0.2,
            x: this.randomIntFromInterval(-15, 15),
            y: this.randomIntFromInterval(-15, 15)
        });

        tl.to(this.img.filters[0].red, {
            duration: 0.01,
            x: 0,
            y: 0
        });

        tl.to(this.img.filters[0].blue, {
            duration: 0.2,
            x: this.randomIntFromInterval(-15, 15),
            y: 0,
            onComplete() {

                THAT.img.filters[1].slices = 20;
                THAT.img.filters[1].direction = THAT.randomIntFromInterval(-75, 75);

                // console.log(THAT.img.filters[1].slices)

            }
        }, '-=0.2');

        tl.to(this.img.filters[0].blue, {
            duration: 0.1,
            x: this.randomIntFromInterval(-15, 15),
            y: this.randomIntFromInterval(-5, 5),
            onComplete() {

                THAT.img.filters[1].slices = 12;
                THAT.img.filters[1].direction = THAT.randomIntFromInterval(-75, 75);

            }
        });

        tl.to(this.img.filters[0].blue, {
            duration: 0.01,
            x: 0,
            y: 0,
            onComplete() {

                THAT.img.filters[1].slices = 0;
                THAT.img.filters[1].direction = 0;

            }
        });

        tl.to(this.img.filters[0].green, {
            duration: 0.2,
            x: this.randomIntFromInterval(-15, 15),
            y: 0
        }, '-=0.2');

        tl.to(this.img.filters[0].green, {
            duration: 0.1,
            x: this.randomIntFromInterval(-20, 20),
            y: this.randomIntFromInterval(-15, 15)
        });

        tl.to(this.img.filters[0].green, {
            duration: 0.01,
            x: 0,
            y: 0
        });

        tl.timeScale(1.2);
    }
}
