import React from 'react'

import '../Styles/Footer.css'

export default function Footer() {
    return (
        <footer>
            <p>
                &copy; TaskTracker - {new Date().getFullYear()}
            </p>
        </footer>
    )
}
