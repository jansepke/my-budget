import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";

interface ExpandableTableRowProps extends React.PropsWithChildren {
  expandComponent: React.ReactNode;
}
export const ExpandableTableRow: React.FC<ExpandableTableRowProps> = ({ children, expandComponent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow hover onClick={() => setIsExpanded(!isExpanded)}>
        <TableCell>
          <IconButton sx={{ p: 0 }}>
            {isExpanded ? (
              <KeyboardArrowUpIcon sx={{ fontSize: "15px" }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />
            )}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && expandComponent}
    </>
  );
};
