import React from 'react'

import '../Styles/Footer.css'

function Footer() {
    return (
        <footer>
            <p>
                &copy; TaskTracker - {new Date().getFullYear()}
            </p>
        </footer>
    )
}

export default Footer