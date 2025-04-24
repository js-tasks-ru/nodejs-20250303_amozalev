import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "../../users/users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      clientID: configService.get("oauth.google.secret"),
      clientSecret: configService.get("oauth.google.clientSecret"),
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.userService.findOne(profile.id);
    if (!user) {
      const { id, displayName, photos } = profile;
      user = await this.userService.create({
        id: id,
        displayName: displayName,
        avatar: photos[0].value,
      });
    }

    return user;
  }
}
