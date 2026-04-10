import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { HealthController } from "./health/health.controller";

jest.mock("@nestjs/mongoose", () => {
  const original =
    jest.requireActual<typeof import("@nestjs/mongoose")>("@nestjs/mongoose");
  return {
    ...original,
    MongooseModule: {
      ...original.MongooseModule,
      forRootAsync: jest.fn().mockReturnValue({
        module: class MockMongooseRootModule {},
        providers: [],
        exports: [],
      }),
      forFeature: jest
        .fn()
        .mockImplementation((models: Array<{ name: string }> = []) => ({
          module: class MockMongooseFeatureModule {},
          providers: models.map((m) => ({
            provide: original.getModelToken(m.name),
            useValue: {},
          })),
          exports: models.map((m) => original.getModelToken(m.name)),
        })),
    },
  };
});

jest.mock("@nestjs/jwt", () => {
  const original =
    jest.requireActual<typeof import("@nestjs/jwt")>("@nestjs/jwt");
  return {
    ...original,
    JwtModule: {
      ...original.JwtModule,
      registerAsync: jest.fn().mockReturnValue({
        module: class MockJwtModule {},
        providers: [
          { provide: original.JwtService, useValue: { sign: jest.fn() } },
        ],
        exports: [original.JwtService],
      }),
    },
  };
});

describe("AppModule", () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it("should be defined", () => {
    expect(module).toBeDefined();
  });

  it("should have HealthController from HealthModule", () => {
    const controller = module.get(HealthController, { strict: false });
    expect(controller).toBeDefined();
  });
});
