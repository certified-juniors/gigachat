import { Link } from 'react-router-dom';
import { ChatList, ChatNav, Chat, } from '../../components';

import './index.css'

function MainPage() {

    return (<>
        <div className='h-screen w-full flex flex-row p-4 gap-4'>

            <div className='h-full w-full sm:w-8/12 md:w-7/12 lg:w-5/12 flex flex-col justify-between'>
                <div className='overflow-y-auto scroll-auto scrollbar'>
                    <ChatList />
                </div>
                <ChatNav />
            </div>

            <div className='h-full w-full'>
                <Chat />
            </div>

        </div>
    </>)
}

export { MainPage };