import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'

const Navbar = ({handleClick, isLoggedIn}) => (
  <div>
    <h1>BlackJack</h1>
    <nav>
      
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <Link to="/BlackJack">BlackJack</Link>
        </div>
        
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
// const mapState = state => {
//   // return {
//   //   isLoggedIn: !!state.auth.id
//   // }
// }

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(null, mapDispatch)(Navbar)
