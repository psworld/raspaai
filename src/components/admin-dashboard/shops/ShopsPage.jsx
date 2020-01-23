import { Button, List, ListItem } from '@material-ui/core';
import React from 'react';
import Link from '../../core/Link';

export default function ShopsPage() {
  const shopActionList = [
    { title: 'Add shop', url: 'add' },
    { title: 'Add plan to shop', url: 'add-plan' }
  ];

  return (
    <div>
      <List>
        {shopActionList.map(action => (
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
