import logo from '../assets/login.png'
import { Button, Form} from 'antd'
import { CheckCircleFilled} from '@ant-design/icons';
import VHlogo from '../assets/vhlogo.png'
import { useNavigate } from 'react-router-dom';
 
export default function SentPassword() {
    const navigate = useNavigate();
    const handleRoute = () => {
        return navigate("/");
    }
    const handleSent = () => {
        window.open('https://mail.google.com/', '_blank');
    }
    return (
        <div className='flex'>
            <div className='hidden sm:block  flex-col justify-center items-center h-full bg-gray-100 w-2/5' >
                <img src={logo} alt='Resim' className='w-full h-screen' />
            </div>
            <div className='flex  justify-center items-center h-screen bg-white w-3/5'>
                <Form className='flex flex-col gap-5 w-full mx-auto max-w-md'>
                    <div>
                    <CheckCircleFilled style={{fontSize:42 , marginBottom:16,color:'#52C41A'}}/>
                        <h1 className='text-2xl font-semibold mb-2'>Şifreniz Gönderildi!</h1>
                        <p className='text-base font-light'>Şifrenizi sıfırlamak için lütfen e-postanızı kontrol edin</p>
                    </div>
                    <button
                            type='submit'
                            className='bg-black text-white w-full h-9 hover:bg-gray-700 rounded-lg flex items-center justify-center'
                            onClick={handleSent}
                        >Mail adresini kontrol et
                        </button>
                    <Button className='h-9 border-1 border-[#133163]  text-[#133163]' onClick={() => handleRoute()}>Giriş sayfasına geri dön</Button> 
                    
                </Form>
                <div class="fixed bottom-0 right-0 mb-6 mr-4">
                    <img src={VHlogo} alt="Resim" class="w-[156px] h-[22px]" />
                </div>
            </div>
        </div>
    )
}