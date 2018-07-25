import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { editingQuiz } from '../../Ducks/Reducer';
import './Host-Question.css'

class Questions extends Component {
    constructor() {
        super();
        this.state = {
            questions: [],
            quiz: {},
            newName: '',
            newInfo: '',
            toggle: false
        }
    }
    componentDidMount() {
        this.setState({
            quiz: this.props.quizToEdit
        })
        this.getQuestions();
    }

    getQuestions() {
        axios.get(`/api/getquestions/${this.props.quizToEdit.id}`).then(res => {
            this.setState({
                questions: res.data,
            })
        })
    }

    deleteQuestion(id) {
        axios.delete(`/api/deletequestion/${id}`).then(res => {
            this.getQuestions()
        })
    }

    displayEdit(){
        this.setState({
            toggle: !this.state.toggle
        })
    }

    updateQuiz() {
        let { newName, newInfo, quiz } = this.state;
        if (newName && newInfo) {
            axios.put('/api/updatequiz', { newName, newInfo, id: quiz.id }).then(res => {
                this.handleUpdatedQuiz(quiz.id)
            })
        } else {
            alert('All fields must be completed')
        }
    }
    handleUpdatedQuiz(id) {
        axios.get(`/api/getquiz/${id}`).then(res => {
            this.props.editingQuiz(res.data[0])
            this.setState({
                quiz: this.props.quizToEdit
            })
        })
    }

    render() {
        let { questions } = this.state;
        if (questions) {
            var mappedQuestions = questions.map((question) => {
                return (
                    <div key={question.id} >
                        <h1>{question.question}</h1>
                        <ul>
                            <li>1:{question.answer1}</li>
                            <li>2:{question.answer2}</li>
                            <li>3:{question.answer3}</li>
                            <li>4:{question.answer4}</li>
                            <li>Correct:{question.correctanswer}</li>

                        </ul>
                        <Link to={`/host/editquestion/${question.id}`}>
                            <button className='btn-play' >Edit</button>
                        </Link>
                        <button onClick={() => this.deleteQuestion(question.id)} className='btn-play'>Delete</button>
                    </div>
                )
            })

        }

        return (
            <div className= 'mapped-container' >
                { 
                    !this.state.toggle 
                        ?
                    <div>
                        <div className='btn-done-div'>
                            <Link to='/host'>
                                <button className='btn-play btn-done' >Done</button>
                            </Link>
                        </div>
                    <div>
                        <h1 className='kwizz-info kwizz-title'>{this.state.quiz.quiz_name}</h1>
                        <p>{this.state.quiz.info}</p>
                        <button onClick={() => this.displayEdit()} className='btn-play' >Update</button>
                    </div>
                    </div>
                        :
                        <div>
                <Link to='/host'>
                    <button className='btn-play' >Done</button>
                </Link>
                        <h1>{this.state.quiz.quiz_name}</h1>
                        <p>{this.state.quiz.info}</p>
                        <input placeholder='New name' onChange={(e) => this.setState({ newName: e.target.value })} />
                        <textarea placeholder='New description' onChange={(e) => this.setState({ newInfo: e.target.value })}></textarea>
                    
                        <button onClick={() => this.updateQuiz()} className='btn-play'>Save</button>
                        <button onClick={() => this.displayEdit()} className='btn-play' >Cancel</button>
                    
                        <hr />
                    </div>
                }
                {mappedQuestions}
                <div>
                    <Link to={`/host/newquestion/${this.props.quizToEdit.id}`} >
                        <button className='btn-play'>Add Question</button>
                    </Link>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        quizToEdit: state.quizToEdit
    }
}

export default connect(mapStateToProps, { editingQuiz })(Questions)