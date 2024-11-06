import { Button, Modal } from "antd";

const GameEndModal = ({ isOpen, message, onRetry, onExit }) => {
    return (
        <Modal
            title='Result of the game'
            open={isOpen}
            onCancel={onExit}
            footer={[
                <Button key='retry' type='primary' onClick={onRetry}>Play Again</Button>,
                <Button key='exit' type="primary" onClick={onExit}>Exit</Button>
            ]}
        >
            <p>{message}</p>
        </Modal>
    )
}

export default GameEndModal