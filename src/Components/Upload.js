import React from 'react'
import AnimeDancing from '../Images/dancingAnime.gif';
import Spinner from '../Images/loader-gif-300-spinner-white.gif';
import { uploadFile } from 'react-s3';

import 'bootstrap/dist/css/bootstrap.min.css';


export default class Upload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: false,
            pause: true,
            selectedFile: null,
            loading: false
        }
        // this.url = 'https://2ngpmfc7ll.execute-api.us-east-1.amazonaws.com/dev/songs/haroun-lofi';
        this.url = 'http://localhost:4000/songs/haroun-lofi';
        this.bucket = 'haroun-lofi';
    }

    handleChange = (event) => {
        const file = event.target.files[0]
        console.log(file);
        this.setState({
            selectedFile: file
        });
    }

    handleUpload = async (event) => {
        if (!this.state.selectedFile) {
            return;
        }

        try {
            // const data = new FormData();
            // data.append('file', this.state.selectedFile);

            // const response = await axios.post(this.url, data);
            const config = {
                bucketName: this.bucket,
                region: process.env.REACT_APP_REGION,
                accessKeyId: process.env.REACT_APP_ACCESS_KEY,
                secretAccessKey: process.env.REACT_APP_SECRET_KEY,
            }
            
            // set spinner when trying to load
            this.setState({loading: true});
            uploadFile(this.state.selectedFile, config)
                .then(data => console.log(data))
                .catch(err => console.error(err))
                .finally(() => this.setState({loading: false, selectedFile: null}))
        } catch (error) {
            console.log(error);
            alert(error);
            this.setState({ selectedFile: null });
        }
    }

    render() {
        let fileName = this.state.selectedFile && this.state.selectedFile.name ? this.state.selectedFile.name : "Choose Song";

        if (this.state.loading) {
            return (
                <div>
                    <img style={styles.spinner} src={Spinner}></img>
                    <img style={styles.image} src={AnimeDancing}></img>
                </div>
            )
        }

        return (
            <div style={styles.fileInput}>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroupFileAddon01" onClick={this.handleUpload}>Upload</span>
                    </div>
                    <div class="custom-file">
                        <input type="file" accept=".wav, .mp3" class="custom-file-input" id="inputGroupFile01"
                            aria-describedby="inputGroupFileAddon01" onChange={this.handleChange} />
                        <label class="custom-file-label" for="inputGroupFile01">{fileName}</label>
                    </div>
                </div>
            </div>
        )
    }
}

const styles = {
    fileInput: {
        padding: '20rem'
    },
    image: {
        height: '25rem',
        position: 'fixed',
        top: '50%',
        left: '50%',
        /* bring your own prefixes */
        transform: 'translate(-50%, -50%)',
        borderRadius: "50%"
    },
    spinner: {
        height: '35rem',
        position: 'fixed',
        top: '50%',
        left: '50%',
        /* bring your own prefixes */
        transform: 'translate(-50%, -50%)'
    }
}