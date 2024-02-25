import { Category } from "@/domain";
import ApartmentIcon from "@mui/icons-material/Apartment";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import ChairIcon from "@mui/icons-material/Chair";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EuroIcon from "@mui/icons-material/Euro";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaymentsIcon from "@mui/icons-material/Payments";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SavingsIcon from "@mui/icons-material/Savings";
import TourIcon from "@mui/icons-material/Tour";
import TvIcon from "@mui/icons-material/Tv";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Avatar from "@mui/material/Avatar";
import React from "react";

const icons: Record<string, React.ReactElement> = {
  euro: <EuroIcon />,
  house: <ApartmentIcon />,
  shield: <VerifiedUserIcon />,
  child: <ChildCareIcon />,
  car: <DirectionsCarIcon />,
  savings: <SavingsIcon />,
  tv: <TvIcon />,
  groceries: <LocalGroceryStoreIcon />,
  restaurant: <RestaurantMenuIcon />,
  delivery: <DeliveryDiningIcon />,
  fastfood: <FastfoodIcon />,
  cash: <PaymentsIcon />,
  book: <MenuBookIcon />,
  wardrobe: <CheckroomIcon />,
  present: <CardGiftcardIcon />,
  furniture: <ChairIcon />,
  flag: <TourIcon />,
};

interface CategoryIconProps {
  category?: Category;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  return <Avatar>{category?.icon ? icons[category?.icon] : category?.value ?? "?"}</Avatar>;
};
