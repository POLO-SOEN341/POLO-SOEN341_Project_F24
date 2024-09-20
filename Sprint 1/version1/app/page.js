import Login from './components/Login';
import Link from 'next/link';

export default function Home( {
  return (
    <div>
      <Link href="/login">
        <h1>Login</h1>
      </Link>
      <br />
      <Link href="/signup">
        <h1>Signup</h1>
      </Link>
    </div>  
  );
}
