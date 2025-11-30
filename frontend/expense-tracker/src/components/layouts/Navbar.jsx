import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import { LuBot } from 'react-icons/lu'
import SideMenu from './SideMenu'
import AIHelpChat from '../AIHelp/AIHelpChat'

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const [aiHelpOpen, setAiHelpOpen] = useState(false);
    const [aiAnchorRect, setAiAnchorRect] = useState(null);
    const botBtnRef = React.useRef(null);
    const location = useLocation();
    const isAuthPage = location?.pathname?.startsWith('/login') || location?.pathname?.startsWith('/signup');
    return (
        <div className='flex gap-5 items-center justify-between bg-white border border-grey-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-10'>
            <div className='flex gap-5 items-center'>
                <button
                    className='block lg:hidden text-black'
                    onClick={() => {
                        setOpenSideMenu(!openSideMenu)
                    }}>
                    {openSideMenu ? (
                        <HiOutlineX
                            className='text-2xl'
                        />
                    ) : (
                        <HiOutlineMenu
                            className='text-2xl'
                        />
                    )}
                </button>
                <h2
                    className='text-lg font-medium text-black'
                >
                    Expense Tracker
                </h2>
            </div>
            <div className='flex items-center gap-2'>
                <button
                    ref={botBtnRef}
                    onClick={() => {
                        const newOpen = !aiHelpOpen;
                        if (newOpen && botBtnRef.current) {
                            const rect = botBtnRef.current.getBoundingClientRect();
                            setAiAnchorRect(rect);
                        }
                        setAiHelpOpen(newOpen);
                    }}
                    className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
                    title="AI Help"
                >
                    <LuBot className='text-xl text-emerald-500' />
                </button>
            </div>
            <AIHelpChat isOpen={aiHelpOpen} onClose={() => setAiHelpOpen(false)} anchorRect={aiAnchorRect} />
            {openSideMenu &&
                <div
                    className='fixed top-[61px] -ml-4 bg-white'>
                    <SideMenu
                        activeMenu={activeMenu}
                    />
                </div>
            }
        </div>
    )
}

export default Navbar
