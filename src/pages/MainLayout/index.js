import { Button, Flex } from "antd";
import { Outlet, Link } from "react-router-dom";
import { ROUTE_CONSTANTS } from "../../core/utils/constants";
import './index.css'

const MainLayout = () => {
    return (
        <div>
            <main>
                <div className="main_layout_container">
                    <h2>Who wants to be a millionaire</h2>
                    <p>
                        This is the online version of the legendary game
                        who wants to be a millionaire, if you think you could win the million,
                        then register or log in to your page and try.
                    </p>
                    <Flex align="center" justify="center" gap={50}>
                        <Link to={ROUTE_CONSTANTS.LOGIN}><Button type="primary">Sign In</Button></Link>
                        <Link to={ROUTE_CONSTANTS.REGISTER}><Button type="primary">Sign Up</Button></Link>
                    </Flex>
                </div>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout