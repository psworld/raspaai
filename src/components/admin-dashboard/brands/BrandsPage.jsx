import React from 'react';
import { List, ListItem, Button } from '@material-ui/core';
import Link from '../../core/Link';

export default function BrandsPage() {
  const brandActionList = [
    { title: 'Add brand', url: 'add' },
    { title: 'Add plan to brand', url: 'add-plan' }
  ];
  return (
    <div>
      <List>
        {brandActionList.map(action => (
          <ListItem key={action.title}>
            <Button
              component={Link}
              variant='outlined'
              to={`${window.location.pathname}/${action.url}`}>
              {action.title}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
