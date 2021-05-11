import React from 'react';
import {Link} from 'react-router-dom'
import '../styles/styles.css'

function Header(){
    return(
        <nav className="bg-gray-900 w-full border-b border-gray-800">
            <div className="max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <Link to="/options/SPY" id="headerTitle">
                        <h3 className="text-gray-200 text-lg" >OptionsTrack</h3>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Header;