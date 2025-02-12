import { Avatar, Drawer, Switch, Button, Modal } from 'antd'
import '../../Styles/MainPage.css'
import { EditOutlined, FileImageOutlined, LogoutOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CreatePost from './CreatePost'


function MainNav({ addPost }){
    const [visible, setVisible] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [isModelVisible, setIsModelVisible] = useState(false)
    const navigate = useNavigate()

    useEffect(()=>{
        document.documentElement.setAttribute("data-theme",theme);
        localStorage.setItem("theme",theme);
    },[theme])

    const toggleTheme = ()=>{
        setTheme(theme==="light" ? "dark" : "light");
    }

    // open modal
    const handleOpenModal =()=>{
        setIsModelVisible(true)
    }
    const handleCloseModal = ()=>{
        setIsModelVisible(false)
    }

    return(
        <nav className='navbar1'>
            {/* Left: User avatar */}
            <Avatar 
            size="large"
            icon={<UserOutlined />}
            className='user-avatar'
            onClick={()=> setVisible(true)}/>
            {/* center navigation links */}
            <div className="nav-links">
               <Button type="link" onClick={() => navigate("/main/feed")}>Feed</Button>
              <Button type="link" onClick={() => navigate("/main/questions")}>Questions</Button>  
              <Button type='link' onClick={()=> navigate("/main/mainCommunity")}>Community</Button>
            </div>
            {/* right: post button and toggle */}
            <div className="nav-right">
                <Switch 
                checked={theme=="dark"}
                onChange={toggleTheme}
                checkedChildren="🌙"
                unCheckedChildren="☀️"/>
                <Button type="primary" className="post-btn" onClick={handleOpenModal}>Post</Button>
            </div>
             {/* Sidebar (Drawer) */}
             <Drawer 
             title="Profile Menu"
             placement='left'
             onClose={()=> setVisible(false)}
             open={visible}
             width={250}>
             <p>
                <FileImageOutlined /> Change Profile Picture
             </p>
             <p>
                <EditOutlined /> Edit Profile
             </p>
             <p>
                <TrophyOutlined /> View Achievements
             </p>
             <p>
                <LogoutOutlined />Logout
             </p>
             </Drawer>
             {/* Create Post Modal */}
             <Modal open={isModelVisible} onCancel={handleCloseModal} footer={null}>
                 <CreatePost closeModal={handleCloseModal} addPost={addPost} />
             </Modal>
        </nav>
    )
}
 export default MainNav