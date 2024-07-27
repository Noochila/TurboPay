import styles from '../new-customer/new-customer.module.css'
import { useLocation, useNavigate } from 'react-router-dom';

export function Banking() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get("token");
    const user_identifier = queryParams.get('user_identifier');
    const amount=queryParams.get('amount')
 

    const onWithdraw = (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/signin');
            return;
        }

        

        fetch(`http://localhost:3100/internetbanking?token=${token}&user_identifier=${user_identifier}&amount=${amount}&username=${username}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, amount })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
            });
            window.location.href = 'http://localhost:3000/dashboard';
            // navigate('http://localhost:3000/dashboard')
    }

    return (
        <div className={styles.custCont}>
            <h1>Withdraw Amount</h1>
            <form onSubmit={onWithdraw}>
               
                <input type='submit' value='Confirm' />
            </form>
        </div>
    );
}
