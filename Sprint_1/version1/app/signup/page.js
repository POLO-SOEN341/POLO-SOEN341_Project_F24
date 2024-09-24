import Signup from '../components/Signup';

export default function signup() {
    return (
        <div>
            <Signup />
            <p>Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
        </div>
    );
}