import React, { useState } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
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
import Amplify, { Auth } from "aws-amplify";
import awsconfig from "../../../aws-exports";
import { Redirect } from "react-router";

Amplify.configure(awsconfig);

const initialFormState = {
  username: "",
  password: "",
  rpassword: "",
  email: "",
  code: "",
  formType: "signUp",
};

const Register = () => {
  const [formState, updateFormState] = useState(initialFormState);

  function onChange(e) {
    e.preventDefault();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
  }

  const { formType } = formState;

  async function signUp(e) {
    e.preventDefault();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
    const { username, email, password, rpassword } = formState;
    if (username && email && password && rpassword===password) {
      await Auth.signUp({ username, password, rpassword,  attributes: { email } })
        .then((data) => {
          updateFormState(() => ({ ...formState, formType: "confirmSignUp" }));
        })
        .catch((err) => {
          alert(err.message);
        });
    } else if(username && password && email && !password===rpassword){
      alert("please enter the same password");
    }else{
      alert("Please enter your valid details")
    }
  }
  async function confirmSignUp(e) {
    e.preventDefault();
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }));
    const { username, code } = formState;
    if (code) {
      await Auth.confirmSignUp(username, code)
        .then((data) => {
          alert("user created successfully")
          updateFormState(() => ({ ...formState, formType: "signIn" }));
        })
        .catch((err) => {
          alert(err.message)
        });
    } else {
      alert("enter the valid code");
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      {formType === "signUp" && (
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={signUp}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        name="username"
                        onChange={onChange}
                        placeholder="Username"
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>@</CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="text"
                        name="email"
                        onChange={onChange}
                        placeholder="Email"
                        autoComplete="email"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={onChange}
                        autoComplete="new-password"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        type="password"
                        name="rpassword"
                        placeholder="Repeat Password"
                        onChange={onChange}
                        autoComplete="new-password"
                      />
                    </CInputGroup>

                    <CButton color="success" type="submit" block>
                      Create Account
                    </CButton>
                    <p className="text-center mt-3">Or</p>
                    <CButton color="primary" to="/login" type="submit" block>
                      Log In
                    </CButton>
                  </CForm>
                </CCardBody>
                <CCardFooter className="p-4">
                  <CRow>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-facebook mb-1" block>
                        <span>facebook</span>
                      </CButton>
                    </CCol>
                    <CCol xs="12" sm="6">
                      <CButton className="btn-twitter mb-1" block>
                        <span>twitter</span>
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      )}
      {formType === "confirmSignUp" && (
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="9" lg="7" xl="6">
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={confirmSignUp}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="code"
                        type="text"
                        placeholder="verification-code"
                        onChange={onChange}
                        autoComplete="verification-code"
                      />
                    </CInputGroup>

                    <CButton color="success" type="submit" block>
                      Submit
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      )}
      {formType === "signIn" && <Redirect to="/login" />}
    </div>
  );
};

export default Register;
