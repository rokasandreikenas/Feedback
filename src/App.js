import React, { Component } from 'react'
import './App.css';
import { Comment, Header } from 'semantic-ui-react'


export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            name: '',
            email: '',
            comment: '',
            date: new Date(),
            isLoaded: false,
        }

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.dateFormater(this.state.date);
        this.callBackendAPI()
            .then(res => {
                this.setState({
                    data: res.body,
                    isLoaded: res.success

                })
            })
            .catch(err => console.log(err));
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    };

    onSubmit(e) {
        e.preventDefault();
        this.saveFeedback();
        this.commentSection();
    }

    resetData() {
        this.setState({
            name: "",
            email: "",
            comment: ""
        })
    }

    saveFeedback() {
        const { name, email, comment, date } = this.state;
        let feedbacks = this.state.data;
        const feedback = {
            name: name,
            mail: email,
            date: date,
            comment: comment
        };

        feedbacks.push(feedback)

        fetch('/feedbacks', {
            method: 'POST',
            body: JSON.stringify(feedback),
            headers: { "Content-Type": "application/json" }
        })
            .then(function (response) {
                return response.json()
            }).then(function (body) {
                console.log(body);
            });

        this.setState({
            data: feedbacks
        })

        this.resetData();
    }

    dateFormater(date) {
        let formattedDate = new Date();
        if (date != null) {
            if (date.getMonth() + 1 < 10 && date.getDate() < 10) {
                formattedDate = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-0" + date.getDate()
            }
            else if (date.getDate() < 10) {
                formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-0" + date.getDate()
            }
            else if (date.getMonth() + 1 < 10) {
                formattedDate = date.getFullYear() + "-0" + (date.getMonth() + 1) + "-" + date.getDate()
            }
            else {
                formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
            }

            this.setState({
                date: formattedDate
            })

            return formattedDate
        }
    }

    callBackendAPI = async () => {
        const response = await fetch('/feedbacks');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message)
        }
        return body;
    };

    commentSection = () => {
        if (this.state.isLoaded === true) {
            let commentsForm = [];
            let children = [];

            children.push(
                this.state.data.map((feedback, i) => (
                    <Comment key={i}>
                        <Comment.Content>
                            <Comment.Author as='a'>{feedback.name} ({feedback.mail})</Comment.Author>
                            <Comment.Metadata>
                                <div>{this.state.date}</div>
                            </Comment.Metadata>
                            <Comment.Text>{feedback.comment}</Comment.Text>
                        </Comment.Content>
                    </Comment >
                )
                )
            )
            commentsForm.push(
                <Comment.Group key={0}>
                    <Header as='h3' dividing>
                        Feedbacks
                </Header>
                    {children}
                </Comment.Group>)
            return commentsForm
        }
    }

    render() {
        return (
            <div className="App">
                <h3>Leave feedback</h3>
                <div>
                    <form onSubmit={this.onSubmit}>
                        <label>First Name</label>
                        <input type="text"
                            id="name"
                            name="name"
                            placeholder="Your name.."
                            value={this.state.name}
                            onChange={this.handleChange}
                            required
                        />
                        <label>Email</label>
                        <input type="email"
                            id="email"
                            name="email"
                            placeholder="Your email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            required
                        />
                        <label>Date</label>
                        <label value={this.state.date}></label>
                        <input type="text"
                            id="date"
                            name="todayDate"
                            value={this.state.date}
                            readOnly
                        />
                        <label>Feedback</label>
                        <textarea id="comment"
                            name="comment"
                            placeholder="Leave a feedback.."
                            value={this.state.comment}
                            onChange={this.handleChange}
                            rows="6"
                            cols="33"
                            required
                        >
                        </textarea>
                        <input type="submit" value="Submit" />
                    </form>
                </div>
                <div>
                    {this.commentSection()}
                </div>
            </div>
        )
    }
}
