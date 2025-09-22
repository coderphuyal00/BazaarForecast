import { useNavigate } from 'react-router-dom';
import { useContext,useEffect } from 'react';
import AuthContext from '../context/AuthContext';
function SignInForm2(){
  const {loginUser,user}=useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    await loginUser(e);
    // if (user) {
    //   navigate("/", { replace: true });
    // }
  };
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
//     const navigate = useNavigate();
//     const handleSubmit = async (event) => {
//     event.preventDefault();
//     // const [email, setEmail] = useState('');
//     // const [password, setPassword] = useState('');
     
//   const data = {
//     email:event.target.email.value,
//     password:event.target.password.value
//   };

//   try {
//     const response = await fetch('http://127.0.0.1:8000/api/token/', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       // Handle errors
//       const errorData = await response.json();
//       console.error('Error:', errorData);
//     } else {
//       const result = await response.json();
//       navigate('/')
//       console.log('Success:', result);
//     }
//   } catch (error) {
//     console.error('Network error:', error);
//   }
// };

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
    
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          type="email" id="email" name='email' 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" id="password" name='password'
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          placeholder="••••••••"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot password?</a>
      </div>

      <button type="submit"  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
        Sign In
      </button>
    </form>

    <div className="mt-6 text-center text-sm text-gray-600">
      Don't have an account? 
      <a href="#"  className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</a>
    </div>
  </div>
</div>
    )
}
export default SignInForm2