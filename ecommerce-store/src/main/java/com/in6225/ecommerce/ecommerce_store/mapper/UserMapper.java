package com.in6225.ecommerce.ecommerce_store.mapper;

import com.in6225.ecommerce.ecommerce_store.dto.UserDto;
import com.in6225.ecommerce.ecommerce_store.entity.User;

public class UserMapper {

    public static UserDto mapToUserDto(User user){
        return new UserDto(
                user.getUserid(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserName(),
                user.getEmail()
        );
    }

    public static User mapToUser(UserDto userDto){
        return new User(
                userDto.getUserId(),
                userDto.getFirstName(),
                userDto.getLastName(),
                userDto.getUserName(),
                userDto.getPassword(), // still map password from DTO to Entity
                userDto.getEmail()
        );
    }
}

