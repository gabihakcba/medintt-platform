import { Button, ButtonProps } from 'primereact/button';
import { twMerge } from 'tailwind-merge';

export interface MedinttButtonProps extends ButtonProps {
  // Aquí podrías agregar propiedades extra si quisieras, 
  // pero por ahora ButtonProps es suficiente.
}

export const MedinttButton = ({ 
  size = 'small',
  outlined = true,
  iconPos = 'right',
  className, 
  ...props 
}: MedinttButtonProps) => {

  const finalClass = twMerge(className);

  return (
    <Button 
      size={size}
      outlined={outlined}
      iconPos={iconPos}
      className={finalClass} 
      {...props}
    />
  );
};