export const getSizeVariation = (size?: string) => {
  switch (size) {
    case 'small':
      return {
        padding: 'px-1',
        border: 'border-light-neutral',
        fontSize: 'text-sm',
        selectHeight: 'h-[33px]',
        chevron: 'text-dark scale-[.6]',
        chevronPosition: 'absolute right-0 pr-0.5 bg-white mr-px',
        chevronPadding: '',
        divider: ''
      };
    default:
      return {
        padding: 'px-3',
        border: 'border-gray-400',
        fontSize: '',
        selectHeight: '',
        chevron: 'text-primary scale-75',
        chevronPosition: 'flex items-center justify-center',
        chevronPadding: 'px-2',
        divider: 'border-l border-l-gray-400'
      };
  }
};

