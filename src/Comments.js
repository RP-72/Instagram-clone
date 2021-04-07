import React from 'react'

function Comments({username, text}) {
    return (
        <div>
            <strong>{username} </strong>{text}
        </div>
    )
}

export default Comments
