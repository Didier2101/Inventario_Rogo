import { Button } from '@mui/material';


const ButtonComponent = ({ type = 'button', color, width, text, fontSize, height, margin, onClick }) => {
    return (
        <Button
            variant="contained"
            style={{
                backgroundColor: color,
                width: width,
                height: height,
                fontSize: fontSize,
                marginTop: margin,


            }}
            onClick={onClick}
            type={type}
        >
            {text}
        </Button>
    )
}

export default ButtonComponent