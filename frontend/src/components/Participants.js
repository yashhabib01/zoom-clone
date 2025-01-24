import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { HiChevronDown } from "react-icons/hi";

const Participants = () => {
  const meetingParticipants = useSelector(
    (state) => state.app.meetingParticipants
  );

  return (
    <Box>
      <Menu>
        <MenuButton
          p={1}
          as={Button}
          variant={"outline"}
          colorScheme="transparent"
          color="white"
          rightIcon={<HiChevronDown />}
        >
          <CgProfile size={"1.75rem"} />
        </MenuButton>
        <MenuList>
          {meetingParticipants.map((user) => (
            <MenuItem key={user.userId}>{user.userName}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Participants;
