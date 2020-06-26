import React from 'react'
import playBtn from '../Images/play.png';
import pauseBtn from '../Images/pause.png';
import axios from 'axios';

export default class Music extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            pause: true,
            songName: '',
        }
        this.url = 'https://2ngpmfc7ll.execute-api.us-east-1.amazonaws.com/dev/songs/haroun-lofi';
    }

    componentDidMount = async () => {
        console.log('Component did mount');

        // get songs from s3
        this.queue = await this.getSongs();

        // shuffle queue
        this.shuffle(this.queue);

        // choose first song
        this.audio = new Audio(this.queue[0]);

        // play the song
        this.play();

        // when 1 song ends, chain the next
        this.audio.onended = this.onend;
    }

    play = () => {
        this.audio.play();

        // get song name from url
        let key = this.queue[0].split("/").slice(-1)[0];

        this.setState({
            play: true,
            pause: false,
            songName: this.getNameFromKey(key)
        })
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
        this.audio.src = this.queue[0];
        this.play();
        return;
    }

    // will have to turn into an async func that gets song data from s3
    getSongs = async () => {
        try {
            const response = await axios.get(this.url);
            const songs = response.data.songs;
            return songs;
        } catch (error) {
            console.log(error);
        }

    }

    getNameFromKey = (key) => {
        // trim file extension
        key = key.split('.').slice(0, -1).join('.');

        // go through string and only take words
        key = key.replace(/[^A-Za-z]/g, " ");

        // fix white spaces
        key = key.replace(/\s+/g, ' ').trim()

        return key;
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