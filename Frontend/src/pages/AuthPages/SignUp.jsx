import AuthPageLayout from './AuthPageLayout'
import SignUpForm from '../../components/auth/SignUpForm'


function SignUp(){

    return(
        <>
        <AuthPageLayout layout="signup">
            <SignUpForm/>
        </AuthPageLayout>
        </>
    )
}

export default SignUp