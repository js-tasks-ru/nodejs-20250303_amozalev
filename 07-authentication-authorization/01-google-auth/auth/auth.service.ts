import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findByUsername(username);
  //   if (!user) throw new UnauthorizedException("User not found");
  //
  //   const isPasswordValid = await user.checkPassword(pass);
  //   if (!isPasswordValid)
  //     throw new UnauthorizedException("Invalid credentials");
  //
  //   return user;
  // }

  async login(userProfile: User) {
    const { id, displayName, avatar } = userProfile;

    const user = new User();
    user.id = id;
    user.displayName = displayName;
    user.avatar = avatar;
    const accessToken = await this.generateAccessToken(user);
    // const refreshToken = this.generateRefreshToken(user);
    return {
      access_token: accessToken,
    };
  }

  async generateAccessToken(user: User) {
    return await this.jwtService.signAsync({
      sub: user.id,
      displayName: user.displayName,
      avatar: user.avatar,
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        username: user.displayName,
        type: "refresh",
      },
      { expiresIn: this.configService.get("jwt.refreshTokenExpires") },
    );
  }
}
