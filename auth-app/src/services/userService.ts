import User from "../models/userModel";

export interface ProviderAccount {
  provider: string;
  providerId: string;
  email: string | null;
}

export interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  providers: ProviderAccount[];
}

export class UserService {
  async getUserByEmail(email: string): Promise<UserType | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    return this.toUserType(user);
  }

  async getUserById(id: string): Promise<UserType> {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    return this.toUserType(user);
  }

  async getUserByProviderId(provider: string, providerId: string): Promise<UserType> {
    const user = await User.findOne({
      providers: { $elemMatch: { provider, providerId } },
    });
    if (!user) throw new Error("User not found via provider");
    return this.toUserType(user);
  }

  async upsertUser(userData: {
    provider: string;
    providerId: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
  }): Promise<UserType> {
    const { provider, providerId, email, name, avatarUrl } = userData;

    let user = await User.findOne({
      providers: { $elemMatch: { provider, providerId } },
    });

    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      user = new User({
        name,
        email,
        avatarUrl,
        providers: [{ provider, providerId, email }],
      });
    } else {
      user.name = name;
      user.avatarUrl = avatarUrl;

      const alreadyLinked = user.providers.some(
        (p) => p.provider === provider && p.providerId === providerId
      );
      if (!alreadyLinked) {
        user.providers.push({ provider, providerId, email });
      }
    }

    await user.save();
    return this.toUserType(user);
  }

  async linkProviderToUser(
    userId: string,
    provider: string,
    providerId: string,
    email: string
  ): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const alreadyLinked = user.providers.some(
      (p) => p.provider === provider && p.providerId === providerId
    );
    if (!alreadyLinked) {
      user.providers.push({ provider, providerId, email });
      await user.save();
    }
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken });
  }

  async invalidateRefreshToken(refreshToken: string): Promise<void> {
    await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: "" } }
    );
  }

  private toUserType(userDoc: any): UserType {
    const user = userDoc.toObject();
    return {
      id: user._id.toString(),
      name: user.name ?? null,
      email: user.email ?? null,
      avatarUrl: user.avatarUrl ?? null,
      providers: user.providers ?? [],
    };
  }
}
