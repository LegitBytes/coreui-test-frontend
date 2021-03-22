import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import awsconfig from "../../../aws-exports";
import Auth from "@aws-amplify/auth";
import Amplify from "@aws-amplify/core";

Amplify.configure(awsconfig);

const initialFormState ={
  username:'', password:'', formType:'signIn'
}

const Login = () => {
  const [formState,updateFormState] = useState(initialFormState)


  function  onChange(e){  
    e.preventDefault();
    updateFormState(()=>({...formState, [e.target.name]: e.target.value}))
  }

  const {formType} = formState; 


  async function signIn(e) {
    e.preventDefault();
    updateFormState(()=>({...formState, [e.target.name]: e.target.value}))
    const {username,password} = formState;
    if(username || password){

      await Auth.signIn(username,password)
      .then((data)=>{
        updateFormState(()=>({...formState, formType: 'signedIn'}))
      })
      .catch((err)=>{
        console.log(err)
        alert(err.message)
      })

    }else{
      alert("enter valid credentials")
    }
  } 


  return (
    <div className="c-app c-default-layout flex-row align-items-center">
    {formType === 'signIn' && (

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={signIn}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        name='username'
                        onChange={onChange}
                        placeholder="Username"
                        autoComplete="username"
                        onInvalid={()=> alert('fill it with properly')}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        name='password'
                        onChange={onChange}
                        placeholder="Password"
                        autoComplete="current-password"
                        onInvalid={()=> alert('fill it with properly')}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton
                          color="primary"
                          type="submit"
                          onClick={signIn}
                          className="px-4"
                        >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <Link to="/register">
                      <CButton
                        color="primary"
                        className="mt-3"
                        active
                        tabIndex={-1}
                      >
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      
    )}
    {formType === 'signedIn' && (
      <Redirect to='/dashboard' />
    )}
    </div>
  );
};

export default Login;
