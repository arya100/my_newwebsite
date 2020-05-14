import React from 'react';
import 'firebase/firestore';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import 'moment-timezone';

export class Questions extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      openQAForm: false,
      questions: [],
      qTitle: '',
      qDescription: '',
      qAuthor: '',
      qAuthorEmail: '',
      qCreationTimestamp: null,
      qModificationTimestamp: null,
      editKey: null
    };
    this.unsubscribe = null;
    this.onQuestionEdit = this.onQuestionEdit.bind(this);
    this.openQAForm = this.openQAForm.bind(this);
    this.closeQAForm = this.closeQAForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e){
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onQuestionEdit(id){
    const ref = this.props.dbRef.doc(id);
    ref.get().then((doc) => {
      if (doc.exists) {
        const question = doc.data();
        this.setState({
          key: doc.id,
          editKey: id,
          qTitle: question.qTitle,
          qDescription: question.qDescription,
          qAuthor: question.qAuthor,
          qAuthorEmail: question.qAuthorEmail,
          qCreationTimestamp: question.qCreationTimestamp,
        });
      } else {
        console.log("No such document!");
      }
    });
  }

  openQAForm(){
      this.setState({
          openQAForm: true
      })
  }

  closeQAForm(){
        this.setState({
            editKey: null
        })
  }

  getQuestionForm(){
        const { qTitle, qDescription } = this.state;

        return (<form onSubmit={this.onSubmit}>
                <div className="form-group">
                    <label>Question*</label>
                    <input type="text" className="form-control"
                        id="qTitle" name="qTitle"
                        aria-describedby="emailHelp" 
                        placeholder="Question Title"
                        value={qTitle} onChange={this.onChange}
                    />
                    <small id="questionHelp" className="form-text text-muted">share your questions that you want to ask</small>
                  </div>

                  <div className="form-group">
                    <label>Description & Tags (optional)</label>
                    <textarea className="form-control"
                            id="qDescription"  name="qDescription" value={qDescription}
                            onChange={this.onChange} placeholder="Description"
                            rows="3">
                      
                    </textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button> &nbsp;
                  <button className="btn btn-primary" onClick={this.closeQAForm}>Cancel</button>
            </form>)
    }

  onSubmit(e) {
      e.preventDefault();

      const { qTitle, qDescription, qAuthor, qAuthorEmail, qCreationTimestamp } = this.state;

      this.props.dbRef.doc(this.state.editKey).set({
        qTitle,
        qDescription,
        qAuthor,
        qAuthorEmail,
        qCreationTimestamp,
        qModificationTimestamp: (new Date()).toString(),
      }).then((docRef) => {
        this.setState({
          qTitle: '',
          qDescription: ''
        });
        this.closeQAForm();
      })
      .catch((error) => {
        console.error("Error on updating document: ", error);
      });
  }

  handleEdit(id){
    this.onQuestionEdit(id);
  }

  onCollectionUpdate = (querySnapshot) => {
    const questions = [];
    querySnapshot.forEach((doc) => {
      const { qTitle, qDescription, qAuthor, qAuthorEmail, qCreationTimestamp, qModificationTimestamp } = doc.data();
      questions.push({
        key: doc.id,
        doc, // DocumentSnapshot
        qTitle,
        qDescription,
        qAuthor,
        qAuthorEmail,
        qCreationTimestamp,
        qModificationTimestamp
      });
    });
    this.setState({
      questions
   });
  }

  componentDidMount() {
    this.unsubscribe = this.props.dbRef.orderBy("qCreationTimestamp", "desc").onSnapshot(this.onCollectionUpdate);
  }

  delete(id){
    this.props.dbRef.doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }

  render(){
	return (<section style={{"marginBottom":"50px"}}>
            <div className="container-fluid">
                <h4>Recently Asked Questions</h4>
                <div className="list-group">

                        {this.state.questions.map(item =>
                          <div href="#/" className="list-group-item list-group-item-action flex-column align-items-start" key={item.key}>
                            { this.state.editKey === item.key  
                              ? this.getQuestionForm() 
                              : <div className="d-flex w-100 justify-content-between">
                                  <h5 className="mb-1"><Link to={`/question/${item.key}`}>{item.qTitle}</Link></h5>
                                  <p className="mb-1">{item.qDescription}</p>
                                  <small><Moment fromNow>{new Date(item.qCreationTimestamp)}</Moment></small>                              
                                </div>
                            }
                            {this.props.user && this.props.user.email === item.qAuthorEmail && <div style={{textAlign:"right", fontSize:"11px"}}>
                                <a href="#/" onClick={this.handleEdit.bind(this, item.key)}>Edit</a> &nbsp;
                                <a href="#/" onClick={this.delete.bind(this, item.key)}>Delete</a>
                              </div>
                            }
                          </div>
                        )}
                        <a href="#/" className="list-group-item list-group-item-action flex-column align-items-start">
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">How we can trigger a spring batch job on the basis of zoned time</h5>
                            <small>3 days ago</small>
                          </div>
                        </a>
                        <a href="#/" className="list-group-item list-group-item-action flex-column align-items-start">
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">What is SOLID principal</h5>
                            <small className="text-muted">3 days ago</small>
                          </div>
                        </a>
                        <a href="#/" className="list-group-item list-group-item-action flex-column align-items-start">
                          <div className="d-flex w-100 justify-content-between">
                            <h5 className="mb-1">What is the step to optimise the db</h5>
                            <small className="text-muted">3 days ago</small>
                          </div>
                          <p className="mb-1">.</p>
                          <small className="text-muted">.</small>
                        </a>
                    </div>
            </div>
        </section>);
  }  
}