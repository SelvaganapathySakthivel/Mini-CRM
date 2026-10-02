import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import DialogCloseButton from '../dialogs/DialogCloseButton';

/**
 * Reusable Vuexy-style CRM Dialog component
 *
 * @param {boolean} open - Dialog open state
 * @param {string} title - Dialog title
 * @param {string} [subtitle] - Optional dialog subtitle / description
 * @param {Function} onClose - Close handler
 * @param {Function} [onSubmit] - Submit handler (if form)
 * @param {boolean} [loading] - Loading state for submit button
 * @param {string} [submitText] - Submit button label
 * @param {string} [cancelText] - Cancel button label
 * @param {boolean} [showActions] - Whether to show action footer
 * @param {string} [maxWidth] - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} [fullWidth] - Dialog fullWidth
 * @param {React.ReactNode} children - Dialog content
 * @param {React.ReactNode} [customActions] - Custom action buttons
 * @param {boolean} [disableSubmit] - Disable submit button
 */
export const CRMDialog = ({
  open,
  title,
  subtitle,
  onClose,
  onSubmit,
  loading = false,
  submitText = 'Submit',
  cancelText = 'Cancel',
  showActions = true,
  maxWidth = 'sm',
  fullWidth = true,
  children,
  customActions,
  disableSubmit = false,
  scroll = 'body',
  ...rest
}) => {
  const handleFormSubmit = (e) => {
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      closeAfterTransition={false}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 30px 0 rgba(47, 43, 61, 0.18)',
          overflow: 'visible',
          m: { xs: 2, sm: 3 },
          width: '100%',
        },
      }}
      {...rest}
    >
      <DialogCloseButton onClick={onClose} disabled={loading} disableRipple />

      {title && (
        <DialogTitle
          sx={{
            pt: { xs: 3, sm: 4 },
            px: { xs: 3, sm: 4 },
            pb: 1.5,
            pr: 6,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </DialogTitle>
      )}

      <Box
        component={onSubmit ? 'form' : 'div'}
        onSubmit={onSubmit ? handleFormSubmit : undefined}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', overflow: 'visible' }}
      >
        <DialogContent
          sx={{
            px: { xs: 3, sm: 4 },
            py: 2,
            overflowY: 'auto',
          }}
        >
          {children}
        </DialogContent>

        {showActions && (
          <DialogActions
            sx={{
              px: { xs: 3, sm: 4 },
              pt: 2,
              pb: { xs: 3, sm: 4 },
              gap: 1.5,
              justifyContent: 'flex-end',
            }}
          >
            {customActions ? (
              customActions
            ) : (
              <>
                <Button
                  onClick={onClose}
                  variant="tonal"
                  color="secondary"
                  disabled={loading}
                  sx={{ minWidth: 90 }}
                >
                  {cancelText}
                </Button>
                {onSubmit && (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading || disableSubmit}
                    sx={{ minWidth: 110 }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : submitText}
                  </Button>
                )}
              </>
            )}
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
};

export default CRMDialog;
