import React, { useEffect,useState } from 'react'
import Header from '../layouts/Header'
import User from '../shared/user'
import SearchIcon from '@mui/icons-material/Search'
import {useAuth} from '../../hooks/authstate'
import socket from '../../util/Socket'
const AppLayout = () => (WrappedComponent) => {

    return (props) => {
        let CurrentUser=socket.id;
        let [users,setUsers]=useState({});
        let [friendId,setFriendId]=useState();
        function letsChat(data){
            setFriendId(data.socketID);
            console.log(`Friend id: ${friendId} My iD: ${CurrentUser}`);
        }
        useEffect(()=>{
            socket.on("users",(req)=>{
                setUsers(req);
            });
        },[]);

        let {allUsers}=useAuth();
        function isOnline(user){
            for(let i of users){
                if(user.name==i.userName){
                    return {status:true,socketID:i.userID}   
                }
            }
            return {status:false,socketID:null}
        }
        return (
            <>
                <Header />
                {users.length?<div className='flex h-full'>
                    <div className=' w-4/12 border-r-2 h-[93vh]'>
                    <div className='w-full rounded-3xl h-9 my-2 px-2 border-b-slate-700'><input type="search" className='w-[90%] h-full px-5 text-xl focus:outline-none' placeholder='Search' /><SearchIcon/></div>
                        {allUsers.map((user,index)=>{
                            let live=isOnline(user);
                            return <User key={user._id} name={user.name} live={live} letsChat={letsChat}/>
                        })
                        }
                    </div>
                    <WrappedComponent {...props} {...{ friendId, CurrentUser }}  />
                    <div className='w-2/12 h-[93vh] max-md:hidden'>Third</div>
                </div>:null}
            </>
        );
    }
}

export default AppLayout