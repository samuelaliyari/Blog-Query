import { NavLink } from "react-router-dom";

const Navbar = () => {
	return (
		<header className='header'>
			<nav>
				<NavLink to='/'>Home</NavLink>
				<NavLink to='/admin'>Admin</NavLink>
			</nav>
		</header>
	);
};

export default Navbar;
