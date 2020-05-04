import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SideNav,
  SideNavHeader,
  SideNavItem,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react/es/components/UIShell';
import Search from 'carbon-components-react/es/components/Search';
import { ChevronLeft20, ChevronRight20 } from '@carbon/icons-react';

import { GroupSwitcher } from './group-switcher';
import { MiqLogo } from './miq-logo';
import { carbonizeIcon } from './icon';
import { itemId, linkProps } from './item-type';


const mapItems = (items, root = true) => items.map((item) => (
  item.items.length
  ? <MenuSection key={item.id} {...item} />
  : (
    root
    ? <FirstLevelItem key={item.id} {...item} />
    : <MenuItem key={item.id} {...item} />
  )
));


const menuItemProps = {
  active: PropTypes.bool,
  href: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

// SideNavLink for first level - needed for icon
const FirstLevelItem = ({ active, href, icon, id, title, type }) => (
  <SideNavLink
    id={itemId(id)}
    isActive={active}
    renderIcon={carbonizeIcon(icon)}
    {...linkProps({ type, href, id })}
  >
    {title}
  </SideNavLink>
);

FirstLevelItem.props = {
  ...menuItemProps,
  icon: PropTypes.string,
};

// SideNavMenuItem can't render icon, but we only have first level icons
const MenuItem = ({ active, href, id, title, type }) => (
  <SideNavMenuItem
    id={itemId(id)}
    isActive={active}
    {...linkProps({ type, href, id })}
  >
    {title}
  </SideNavMenuItem>
);

MenuItem.props = {
  ...menuItemProps,
};


const MenuSection = ({ active, id, items, title, icon }) => (
  <SideNavMenu
    id={itemId(id, true)}
    isActive={active}
    defaultExpanded={active} // autoexpand active section
    renderIcon={carbonizeIcon(icon)} // only first level sections have it, but all need the prop for consistent padding
    title={title}
  >
    {mapItems(items, false)}
  </SideNavMenu>
);

MenuSection.props = {
  active: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
  title: PropTypes.string.isRequired,
};

const MenuFind = () => (
  <SideNavItem>
    <Search
      size="sm"
      placeHolderText={__("Find")}
    />
  </SideNavItem>
);

const MenuCollapse = ({ expanded, toggle }) => (
  <SideNavItem className="menu-collapse">
    <div
      className="menu-collapse-button"
      onClick={toggle}
    >
      {expanded ? <ChevronLeft20 /> : <ChevronRight20 />}
    </div>
  </SideNavItem>
);


const initialExpanded = window.localStorage.getItem('patternfly-navigation-primary') !== 'collapsed';

export const MainMenu = (props) => {
  const { applianceName, currentGroup, currentUser, customBrand, customLogo, imagePath, menu, miqGroups } = props;
  const [expanded, setExpanded] = useState(initialExpanded);

  useEffect(() => {
    window.localStorage.setItem('patternfly-navigation-primary', expanded ? 'expanded' : 'collapsed');

    const classNames = {
      true: 'miq-main-menu-expanded',
      false: 'miq-main-menu-collapsed',
    };
    document.body.classList.remove(classNames[!expanded]);
    document.body.classList.add(classNames[expanded]);
  }, [expanded]);

  const renderIcon = () => (
    <MiqLogo
      customBrand={customBrand}
      imagePath={imagePath}
    />
  );


  return (
    <SideNav
      aria-label={__("Main Menu")}
      isChildOfHeader={false}
      expanded={expanded}
    >
      <SideNavHeader
        renderIcon={renderIcon}
      />

      {/* FIXME initials, collapsed.. */}
      <SideNavItem>
        <p
          data-userid={currentUser.userid}
          id="username_display"
          title={`${currentUser.name} | ${currentUser.userid} | ${applianceName}`}
        >
          {currentUser.name}
        </p>
      </SideNavItem>

      <GroupSwitcher
        currentGroup={currentGroup}
        expanded={expanded}
        miqGroups={miqGroups}
      />

      <MenuFind />

      <hr className="bx--side-nav__hr" />

      <SideNavItems>
        {mapItems(menu)}
      </SideNavItems>

      <MenuCollapse
        expanded={expanded}
        toggle={() => setExpanded(!expanded)}
      />
    </SideNav>
  );
};

const propGroup = PropTypes.shape({
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

const propUser = PropTypes.shape({
  name: PropTypes.string.isRequired,
  userid: PropTypes.string.isRequired,
});

MainMenu.propTypes = {
  applianceName: PropTypes.string.isRequired,
  currentGroup: propGroup.isRequired,
  currentUser: propUser.isRequired,
  customBrand: PropTypes.bool.isRequired,
  customLogo: PropTypes.bool.isRequired,
  imagePath: PropTypes.string.isRequired,
  menu: PropTypes.arrayOf(PropTypes.any).isRequired,
  miqGroups: PropTypes.arrayOf(propGroup).isRequired,
};
