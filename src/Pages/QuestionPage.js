import React from 'react';
import { FormControl, Navbar, Button, Nav, Form } from 'react-bootstrap';
import Moment from 'react-moment';
import './QuestionPage.css';
import Helmet from 'react-helmet';

export class QuestionPage extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			answers: [],
			openAnsForm: false,
			question: null,
			key:'',
			qTitle: '',
			qDescription: '',
			qAuthor: '',
			qAuthorEmail: '',
			qCreationTimestamp: null,
			qModificationTimestamp: null,
			answer: ''
		}

		this.openAnsForm = this.openAnsForm.bind(this);
		this.closeAnsForm = this.closeAnsForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
	}


	onCollectionUpdate = (querySnapshot) => {
	    const answers = [];
	    querySnapshot.forEach((doc) => {
	      const { answer, aAuthor, aAuthorEmail, aCreationTimestamp, aModificationTimestamp } = doc.data();
	      answers.push({
	        key: doc.id,
	        doc, // DocumentSnapshot
	        answer,
	        aAuthor,
	        aAuthorEmail,
	        aCreationTimestamp,
	        aModificationTimestamp
	      });
	    });
	    this.setState({
	      answers
	   }, function(){
	    console.log("print answers", this.state.answers);
	   });
	  }

	componentDidMount() {
	    const ref = this.props.dbRef.doc(this.props.match.params.id);
	    ref.get().then((doc) => {
	      if (doc.exists) {
	        this.setState({
	          question: doc.data(),
	          key: doc.id,
	          isLoading: false
	        });
	      } else {
	        console.log("No such document!");
	      }
	    });

	    this.unsubscribe = this.props.dbAnsRef.where("questionId", "==", this.props.match.params.id).onSnapshot(this.onCollectionUpdate);
	}

	openAnsForm(){
		this.setState({
			openAnsForm: true
		})
	}

	closeAnsForm(){
		this.setState({
			openAnsForm: false
		})
	}

	getAnswerForm(){
		const { answer } = this.state;

        return (<form onSubmit={this.onSubmit}>
  
                  <div className="form-group">
                    <label>Answer Details</label>
                    <textarea className="form-control"
                            id="answer"  name="answer" value={answer}
                            onChange={this.onChange} placeholder="Answer"
                            rows="3">
                      
                    </textarea>
                    <small id="answerHelp" className="form-text text-muted">share your questions that you want to ask</small>
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button> &nbsp;
                  <button className="btn btn-primary" onClick={this.closeAnsForm}>Cancel</button>
            </form>);

	}

	onChange(e){
        const state = this.state
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    onSubmit(e) {
        e.preventDefault();

        const { answer, key } = this.state;

        this.props.dbAnsRef.add({
          answer,
          questionId: key,
          aAuthor: this.props.user.displayName,
          aAuthorEmail: this.props.user.email,
          aCreationTimestamp: (new Date()).toString(),
          aModificationTimestamp: (new Date()).toString(),
        }).then((docRef) => {
          this.setState({
            answer: ''
          });
          this.closeAnsForm();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }

	render(){
        const {
            user,
            signOut,
            signInWithGoogle,
        } = this.props;

    	return (
            <>
            <header>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="/">WebxTutor Interview Q&A</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#/">Tech Support </Nav.Link>
                            <Nav.Link href="#/">Live Training</Nav.Link>
                            <Nav.Link href="#/">Tech Talks</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
                        </Form>
                        { user 

                          ? <> 
                                <Nav.Link href="#/">Hello, {user.displayName}</Nav.Link>
                                <Nav.Link href="#/" onClick={signOut}>Sign Out</Nav.Link>
                            </>

                          : <>
                                <Nav.Link href="#/" onClick={signInWithGoogle}>Login</Nav.Link>
                                <Nav.Link href="#/" onClick={signInWithGoogle}>Sign Up</Nav.Link>
                            </>
                        }
                    </Navbar.Collapse>
                </Navbar>
                <div className="jumbotron">
                	{this.state.question && <>
                        <Helmet>
                          <title>{ this.state.question.qTitle }</title>
                          <meta name="description" content={ this.state.question.qTitle + ',' + this.state.question.qDescription} />
                        </Helmet>
		                    <h1 className="display-4">{ this.state.question.qTitle }</h1>
		                    <pre className="lead">{ this.state.question.qDescription }</pre>
		                    <hr className="my-4"/>
		                    {!this.state.openAnsForm ? <div style={{ fontSize:"14px"}}>
		                            <button className="btn btn-primary" onClick={this.openAnsForm}>Answer</button> 
		                        </div>
		                        : this.getAnswerForm()
		                    }
	                    </>
                	}
                </div>
            </header>

            <section style={{"marginBottom":"50px"}}>
            <div className="container-fluid">
                <div className="list-group">

                        {this.state.answers.map(item =>
                          <div  className="list-group-item list-group-item-action flex-column align-items-start" key={item.key}>
                            
                              <div className="d-flex w-100 justify-content-between dir-column">
                                  
                                  <pre className="mb-1">{item.answer}</pre>
                                  <small className="mb-right"><Moment fromNow>{new Date(item.aCreationTimestamp)}</Moment></small>                              
                                </div>
                          
                          </div>
                        )}
                        
                        
                    </div>
            </div>
        </section>



            </>
            );

    }
}