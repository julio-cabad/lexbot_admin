/**
 * 🧭 MENU CONFIGURATION
 * Configuración del menú de navegación administrativo
 * Siguiendo el patrón de configuración centralizada
 */

import { MenuItem } from '../types';

/**
 * 🎯 CONFIGURACIÓN POR DEFECTO DEL MENÚ
 * Items principales del menú administrativo organizados por features
 */
export const defaultMenuItems: MenuItem[] = [
  // Dashboard Feature
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
  },
  
  // Recipients Feature (to be implemented)
  {
    id: 'recipients',
    label: 'Gestionar Destinatarios',
    icon: 'users',
    route: '/admin/recipients',
  },
  {
    id: 'mail-auth',
    label: 'Autorizar Correo',
    icon: 'mail',
    route: '/admin/mail-auth',
  },
  
  // Email Authorization Feature (example for future implementation)
  // {
  //   id: 'email-authorization',
  //   label: 'Autorizar Correo',
  //   icon: 'mail-check',
  //   route: '/admin/email-authorization',
  // },
  
  // Settings Feature (to be implemented)
  {
    id: 'settings',
    label: 'Configuración',
    icon: 'settings',
    route: '/admin/settings',
    children: [
      {
        id: 'profile',
        label: 'Mi Perfil',
        icon: 'user',
        route: '/admin/settings/profile',
      },
      {
        id: 'preferences',
        label: 'Preferencias',
        icon: 'settings',
        route: '/admin/settings/preferences',
      }
    ]
  }
];

/**
 * 🔧 CONFIGURACIÓN PERSONALIZABLE DEL MENÚ
 * Permite personalizar el menú según necesidades específicas
 */
export const menuConfig = {
  /**
   * Obtener configuración del menú
   */
  getMenuItems(): MenuItem[] {
    // En el futuro, esto podría venir de una API o localStorage
    return defaultMenuItems;
  },

  /**
   * Agregar item al menú
   */
  addMenuItem(item: MenuItem, parentId?: string): MenuItem[] {
    const items = this.getMenuItems();
    
    if (parentId) {
      // Agregar como hijo de un item existente
      const updateItems = (menuItems: MenuItem[]): MenuItem[] => {
        return menuItems.map(menuItem => {
          if (menuItem.id === parentId) {
            return {
              ...menuItem,
              children: [...(menuItem.children || []), item]
            };
          }
          if (menuItem.children) {
            return {
              ...menuItem,
              children: updateItems(menuItem.children)
            };
          }
          return menuItem;
        });
      };
      
      return updateItems(items);
    } else {
      // Agregar como item principal
      return [...items, item];
    }
  },

  /**
   * Remover item del menú
   */
  removeMenuItem(itemId: string): MenuItem[] {
    const items = this.getMenuItems();
    
    const filterItems = (menuItems: MenuItem[]): MenuItem[] => {
      return menuItems
        .filter(item => item.id !== itemId)
        .map(item => ({
          ...item,
          children: item.children ? filterItems(item.children) : undefined
        }));
    };
    
    return filterItems(items);
  },

  /**
   * Verificar permisos de un item
   */
  hasPermission(item: MenuItem, userPermissions: string[]): boolean {
    if (!item.permissions || item.permissions.length === 0) {
      return true; // Sin restricciones
    }
    
    return item.permissions.some(permission => 
      userPermissions.includes(permission)
    );
  },

  /**
   * Filtrar items por permisos
   */
  filterByPermissions(items: MenuItem[], userPermissions: string[]): MenuItem[] {
    return items
      .filter(item => this.hasPermission(item, userPermissions))
      .map(item => ({
        ...item,
        children: item.children 
          ? this.filterByPermissions(item.children, userPermissions)
          : undefined
      }));
  }
};