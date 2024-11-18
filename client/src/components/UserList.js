import React from 'react';

const UserList = ({ users }) => {
    return (
        <div className="user-list">
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.socketId}>
                        User: {user.name}
                    </div>
                ))
            ) : (
                <div>No users connected</div> // Display fallback if no users
            )}
        </div>
    );
};

export default UserList;
