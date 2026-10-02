import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton'

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 14,
  right: 14,
  color: theme.palette.text.secondary || '#64748b',
  backgroundColor: 'transparent',
  padding: 6,
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(15, 23, 42, 0.08)',
    color: theme.palette.text.primary || '#0f172a',
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& svg': {
    width: 20,
    height: 20,
  },
}))

export const DialogCloseButton = ({ children, ...rest }) => {
  return (
    <StyledCloseButton aria-label="close" size="small" {...rest}>
      {children || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      )}
    </StyledCloseButton>
  )
}

export default DialogCloseButton
