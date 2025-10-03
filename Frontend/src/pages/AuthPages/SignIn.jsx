import AuthPageLayout from './AuthPageLayout'
import SignInForm from '../../components/auth/SignInForm'


function SignIn(){

    return(
        <>
        <AuthPageLayout layout="signin">
            <SignInForm/>
        </AuthPageLayout >
        </>
    )
}

export default SignIn