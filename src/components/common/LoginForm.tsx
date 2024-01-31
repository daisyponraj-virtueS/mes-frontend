import React, { FC, 
  // useEffect,
   useState } from "react"
import eyeClose from '../../assets/icons/eye-off.svg';
import eye from '../../assets/icons/eye.svg';
import '../../assets/styles/scss/components/login-form.scss'
import globeLogo from '../../assets/img/globe-logo.png'
// import { useMsal } from "@azure/msal-react";

interface LgoingFormProps {
  handleSubmit: (e: any) => void;
  formErrors:any;
  showPassword:any;
  password:any;
  handlePasswordChange: (e: any) => void;
  setShowPassword: (e: any) => void;
  handleUsernameChange: (e: any) => void;
  email:any;
}

const LoginForm: FC<LgoingFormProps> =({handleSubmit,handleUsernameChange,formErrors,showPassword,password,handlePasswordChange,setShowPassword,email})=>{

  const [isSsoButton,setIsSsoButton] = useState(false)

  // const {instance} = useMsal()

//   const handleSignIn = () => {
//     instance.loginRedirect({
//       scopes:["user.read"]
//     })
//   };
// 	useEffect(()=>{
//     // Perform silent SSO with a login hint
//   instance.ssoSilent({
//     scopes: ["user.read"], // Replace with the necessary scopes for your application
//     loginHint: "", // Replace with the desired login hint
//     })
//     .then((response) => {
//       // Set the active account after successful silent sign-in
//       instance.setActiveAccount(response.account);
//       console.log("successful",response.account)
//     })
//     .catch((error) => {
//       console.error(error);
//       // Handle errors appropriately
//     });
// },[])
// const handleSignOut =()=>{
//   instance.logoutRedirect()
// }
    return(
        <form className="auth-module__main__container" onSubmit={handleSubmit}>
          {/* {isSsoButton ? */}
              <h2 className="text-2xl font-semibold">Login with User ID</h2>
              {/* :<h2 className="text-2xl font-semibold">SSO Login with Ferroglobe ID</h2>
          } */}

              <div className="mt-5 mb-5">
                <div className="input-field-wrapper">
                  <label className="input-field-label">User ID</label>
                  <input
                    type="text"
                    id="userid"
                    className="input-field  input-field--md input-field--h40 text-sm w-full"
                    placeholder="Enter your user ID"
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    name="email"
                    value={email}
                  />
                  <span className="error-message">{formErrors.email}</span>
                </div>
                {/* {!isSsoButton &&  */}
                <div className="input-field-wrapper">
                  <label className="input-field-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      className="input-field input-field--password input-field--md input-field--h40 text-sm w-full"
                      placeholder="Enter your password"
                      name="password"
                      value={password}
                      // minLength={4}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                    />
                    <span className="error-message">{formErrors.password}</span>
                    {showPassword ? (
                      <img
                        src={eye}
                        style={{ position: 'absolute', top: 13, right: 11 }}
                        alt="eye"
                        className="eye-icon eye-icon--normal"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <img
                        src={eyeClose}
                        style={{ position: 'absolute', top: 12, right: 12 }}
                        alt="eye"
                        className="eye-icon eye-icon-close"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </div>
                </div>
                {/* } */}
              </div>
              {/* {error && <span className="error-message ">{error}</span>} */}
              <button
                className="btn btn--primary btn--lg btn--h42 w-full mt-3"
                // onClick={() => setOpenModel(true)}
              >
                Log In
              </button>
              <div className="divider">
                <p />
                <span>Or</span>
                <p/>
              </div>
              
              {/* {isSsoButton? */}

              <button
                className="btn btn--primary btn--lg btn--h42 w-full mt-3 sso-button"
                type="button"
                // onClick={()=>setIsSsoButton(false)}
              >
                <img src={globeLogo} alt="globe"/> &nbsp; SSO Login with Ferroglobe ID
              </button>
              {/* // :
              // <button
              //   className="btn btn--primary btn--lg btn--h42 w-full mt-3 sso-button"
              //   type="button"
              //   onClick={()=>setIsSsoButton(true)}
                
              // >
              //   Login with User ID
              // </button>} */}
              {/* <button onClick={handleSignIn}>Check</button> */}
              {/* <button onClick={handleSignOut}>Check-out</button> */}
            </form>
    )
}

export default LoginForm
