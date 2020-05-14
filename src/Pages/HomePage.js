import React from 'react';

import {Header} from "../components/header";
import {Footer} from "../components/footer";
import {Tags} from "../components/tags";
import {Questions} from "../components/questions";

export class HomePage extends React.Component {
	
	render(){
		return (
			<>
				<Header {...this.props} dbRef={this.props.dbRef}/>
		        <Tags/>
		        <hr className="my-4"/>
		        <Questions {...this.props} dbRef={this.props.dbRef}/>
		        <Footer/>
	        </>
        );
	}
}