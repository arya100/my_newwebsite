import React from 'react';
import { FormControl, Navbar, Button, Nav, Form } from 'react-bootstrap';
export class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            openQAForm: false,
            qTitle: '',
            qDescription: '',
            qAuthor: '',
            qAuthorEmail: '',
            qCreationTimestamp: null,
            qModificationTimestamp: null
        };

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

    onSubmit(e) {
        e.preventDefault();

        const { qTitle, qDescription } = this.state;

        this.props.dbRef.add({
          qTitle,
          qDescription,
          qAuthor: this.props.user.displayName,
          qAuthorEmail: this.props.user.email,
          qCreationTimestamp: (new Date()).toString(),
          qModificationTimestamp: (new Date()).toString(),
        }).then((docRef) => {
          this.setState({
            qTitle: '',
            qDescription: ''

          });
          this.closeQAForm();
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
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
    
    openQAForm(){
        this.setState({
            openQAForm: true
        })
    }

    closeQAForm(){
        this.setState({
            openQAForm: false
        })
    }

    render(){
        const {
            user,
            signOut,
            signInWithGoogle,
        } = this.props;

    	return (
            <header>
                <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand href="./">WebxTutor Interview Q&A</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#">Tech Support </Nav.Link>
                            <Nav.Link href="#">Live Training</Nav.Link>
                            <Nav.Link href="#">Tech Talks</Nav.Link>
                        </Nav>
                        <Form inline>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                            <Button variant="outline-info">Search</Button>
                        </Form>
                        { user 

                          ? <> 
                                <Nav.Link href="#">Hello, {user.displayName}</Nav.Link>
                                <Nav.Link href="#" onClick={signOut}>Sign Out</Nav.Link>
                            </>

                          : <>
                                <Nav.Link href="#" onClick={signInWithGoogle}>Login</Nav.Link>
                                <Nav.Link href="#" onClick={signInWithGoogle}>Sign Up</Nav.Link>
                            </>
                        }
                    </Navbar.Collapse>
                </Navbar>
                
                <div className="jumbotron">
                    <h1 className="display-4">Interview Helpline, Question Answers & Tech Support !</h1>
                    <p className="lead">Ask your questions with technical & Industry experts, experience and trainers across the world!</p>
                    <hr className="my-4"/>
                    {!this.state.openQAForm && <div>
                        <p>Do you have any question ?</p>
                        <p className="lead">
                            <a className="btn btn-primary btn-lg" href="#/" role="button" onClick={user ? this.openQAForm : signInWithGoogle}>Ask Now</a>
                        </p>
                    </div>}
                    {this.state.openQAForm && this.getQuestionForm()}
                </div>
            </header>);

    }
}