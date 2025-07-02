import { useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 w-full flex items-end justify-start text-center backdrop-blur-[20px] h-16 bg-indigo-80 text-black z-10">
        <footer className='w-full flex justify-evenly items-center'>
            <span className='text-2xl flex-1'>{location.pathname}</span>
            <span className='flex-2'>Darius Žvinklys. Copyright &copy; 2025 --- dariuszvinklys.com --- dariuszvinklys@gmail.com </span>
            <span className='text-2xl flex-1'></span>
        </footer>
    </div>
  )
}
