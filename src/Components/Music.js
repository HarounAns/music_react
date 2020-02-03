import React from 'react'
import playBtn from '../Images/play.png';
import pauseBtn from '../Images/pause.png';

export default class Music extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            pause: true,
            songName: '',
        }
    }

    componentDidMount = () => {
        console.log('Component did mount');

        // get songs from s3
        this.queue = this.getSongs();

        // shuffle queue
        this.shuffle(this.queue);

        // choose first song
        this.audio = new Audio(this.queue[0].url);

        // play the song
        this.play();

        // set the name in bottom left
        this.setState({ songName: this.queue[0].name });

        // when 1 song ends, chain the next
        this.audio.onended = this.onend;
    }

    play = () => {
        this.audio.play();
        this.setState({ play: true, pause: false })
    }

    pause = () => {
        this.audio.pause();
        this.setState({ play: false, pause: true })
    }

    toggle = () => {
        if (this.state.play) {
            this.pause();
            return;
        }
        this.pause();
    }

    onend = () => {
        // dequeue the song that was just played
        this.queue.shift();

        // if empty get new songs
        if (!this.queue[0]) {
            this.queue = this.getSongs();

             // shuffle queue
            this.shuffle(this.queue);

            // if still empty, then pause
            if (!this.queue[0]) {
                this.pause();
                return;
            }
        }

        // play next song if exists
        this.audio.src = this.queue[0].url;
        this.setState({ songName: this.queue[0].name });
        this.play();
        return;


    }

    // will have to turn into an async func that gets song data from s3
    getSongs = () => {
        return [
            {
                name: 'Lofi Guitar Melody Loop',
                url: "https://haroun-lofi.s3.amazonaws.com/lofi-guitar-melody-loop_114bpm_D_minor.wav"
            },
            {
                name: "File Example Song",
                url: "https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3"
            },
            {
                name: 'Chill Gaming - David Fesliyan',
                url: 'https://haroun-lofi.s3.amazonaws.com/2019-06-07_-_Chill_Gaming_-_David_Fesliyan.mp3'
            },
            {
                name: 'Homework - David Fesliyan',
                url: 'https://haroun-lofi.s3.amazonaws.com/2019-06-12_-_Homework_-_David_Fesliyan.mp3'
            },
            {
                name: 'I Got This - David Renda',
                url: 'https://haroun-lofi.s3.amazonaws.com/2019-06-12_-_I_Got_This_-_www.fesliyanstudios.com_-_David_Renda.mp3'
            },
            {
                name: 'Vibes - David Renda',
                url: 'https://haroun-lofi.s3.amazonaws.com/2019-08-09_-_Vibes_-_www.FesliyanStudios.com_-_David_Renda.mp3'
            }
        ]
    }

    /**
    * Shuffles array in place. ES6 version
    * @param {Array} a items An array containing the items.
    */ 
    shuffle = (a) => {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    render() {
        if (this.state.pause) {
            return (
                <div className='whole_page'>
                    <img style={styles.image} src={playBtn} onClick={this.play}></img>
                </div>
            );
        }
        return (
            <div className='whole_page'>
                <img style={styles.image} src={pauseBtn} onClick={this.pause}></img>
                <div style={styles.bottomLeft}>{this.state.songName}</div>
            </div>
        );
    }
}

const styles = {
    image: {
        height: '60px'
    },
    bottomLeft: {
        // fontFamily: "Comic Sans",
        position: "absolute",
        bottom: "8px",
        left: "16px",
        fontSize: "32px",
        color: "white"
    }
}