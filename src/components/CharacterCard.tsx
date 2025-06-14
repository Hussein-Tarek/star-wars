import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import type { Character } from "../types/types";

export const CharacterCard = ({
  character,
  onClick,
  speciesColor,
}: {
  character: Character;
  onClick: (character: Character) => void;
  speciesColor: string;
}) => (
  <Card
    component={motion.div}
    whileHover={{ scale: 1.05 }}
    onClick={() => onClick(character)}
    sx={{
      backgroundColor: speciesColor,
      borderRadius: 2,
      boxShadow: 3,
    }}
  >
    <CardActionArea>
      <Box
        component="img"
        src={`https://picsum.photos/seed/${character.name}/300/200`}
        alt={character.name}
        sx={{ width: "100%", height: 200, objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6">{character.name}</Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
